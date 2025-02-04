import React, { useState, useEffect } from "react";
import './Dashboard.css';
import { auth, db } from "./../firebase/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

const Dashboard = () => {
    const [activities, setActivities] = useState([]);
    const [newActivity, setNewActivity] = useState({ name: "", date: "", time: "", description: "" });
    const [showPopup, setShowPopup] = useState(false);
    const [editActivity, setEditActivity] = useState(null);
    const [sortByDate, setSortByDate] = useState(false);
    const [searchDate, setSearchDate] = useState("");
    const user = auth.currentUser;

    const fetchActivities = async () => {
        if (!user) return;
        const activitiesRef = collection(db, "activities");
        const q = query(activitiesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedActivities = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setActivities(fetchedActivities);
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const addActivity = async (e) => {
        e.preventDefault();
        if (!newActivity.name || !user) return;
        if (editActivity) {
            const activityDoc = doc(db, "activities", editActivity.id);
            await updateDoc(activityDoc, newActivity);
            setEditActivity(null);
        } else {
            await addDoc(collection(db, "activities"), {
                ...newActivity,
                completed: false,
                userId: user.uid
            });
        }
        setNewActivity({ name: "", date: "", time: "", description: "" });
        setShowPopup(false);
        fetchActivities();
    };

    const deleteActivity = async (id) => {
        await deleteDoc(doc(db, "activities", id));
        fetchActivities();
    };

    const handleEdit = (activity) => {
        setEditActivity(activity);
        setNewActivity(activity);
        setShowPopup(true);
    };

    const sortActivitiesByDate = () => {
        setSortByDate(!sortByDate);
        setActivities([...activities].sort((a, b) => sortByDate ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)));
    };

    const filterActivitiesByDate = () => {
        if (!searchDate) {
            fetchActivities();
        } else {
            setActivities(activities.filter(activity => activity.date === searchDate));
        }
    };

    const scheduleOnGoogleCalendar = (activity) => {
        const startDateTime = `${activity.date}T${activity.time}:00`;
        const endDateTime = `${activity.date}T${activity.time}:30`;
        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(activity.name)}&details=${encodeURIComponent(activity.description)}&dates=${startDateTime.replace(/[-:]/g, "")}Z/${endDateTime.replace(/[-:]/g, "")}Z`;
        window.open(googleCalendarUrl, "_blank");
    };

    return (
        <div className="p-4 text-center">
            <h1 className="text-2xl mb-4">Simple Activity Planner</h1>
            <button onClick={() => setShowPopup(true)} className="bg-green-500 text-white p-2 rounded">Add Activity</button>
            <button onClick={sortActivitiesByDate} className="bg-blue-500 text-white p-2 rounded ml-2">Sort by Date</button>
            <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="search-date" />
            <button onClick={filterActivitiesByDate} className="bg-gray-500 text-white p-2 rounded ml-2">Search</button>
            {showPopup && (
                <div className="main">
                    <div className="activity-form">
                        <h2 className="text-lg mb-2">{editActivity ? "Edit Activity" : "Create a New Activity"}</h2>
                        <form onSubmit={addActivity}>
                            <label for="activity-name">Activity Name</label>
                            <input type='text' id="activity-name" placeholder="Activity Name" value={newActivity.name} onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })} className="border p-2 w-full" required />

                            <label for="date">Date</label>
                            <input type="date" id="date" value={newActivity.date} onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })} className="border p-2 w-full" required />

                            <label for="time">Time</label>
                            <input type="time" id="time" value={newActivity.time} onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })} className="border p-2 w-full" required />

                            <label for="description">Description</label>
                            <textarea id="description" placeholder="Description" value={newActivity.description} onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} className="border p-2 w-full" required></textarea>
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">{editActivity ? "Update" : "Add"}</button>
                            <button onClick={() => { setShowPopup(false); setEditActivity(null); }} className="ml-2 bg-gray-500 text-white p-2 rounded">Cancel</button>
                        </form>
                    </div>
                </div>
            )}
            <hr></hr>
            <table className="mt-4 w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Activity</th>
                        <th className="border p-2">Date</th>
                        <th className="border p-2">Time</th>
                        <th className="border p-2">Description</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map((activity) => (
                        <tr key={activity.id} className="border">
                            <td className="border p-2">{activity.name}</td>
                            <td className="border p-2">{activity.date}</td>
                            <td className="border p-2">{activity.time}</td>
                            <td className="border p-2">{activity.description}</td>
                            <td className="border p-2">
                                <button onClick={() => handleEdit(activity)} className="bg-yellow-500 text-white p-1 rounded mr-2">Edit</button>
                                <button onClick={() => deleteActivity(activity.id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                                <button onClick={() => scheduleOnGoogleCalendar(activity)} className="bg-blue-500 text-white p-1 rounded ml-2">Schedule</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
