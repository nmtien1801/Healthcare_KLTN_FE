// Script để tạo Firestore index tự động
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';

// Firebase config (copy từ firebase.js)
const firebaseConfig = {
    apiKey: "AIzaSyAYC5lZZxBxdecqhLGMi6XuZFAWnWPCdAs",
    authDomain: "test-chat-firebase-8ef22.firebaseapp.com",
    databaseURL: "https://test-chat-firebase-8ef22-default-rtdb.firebaseio.com",
    projectId: "test-chat-firebase-8ef22",
    storageBucket: "test-chat-firebase-8ef22.appspot.com",
    messagingSenderId: "832944997936",
    appId: "1:832944997936:web:babc5c42c70b6d03b4d3bc",
    measurementId: "G-R0YZVRTKCZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createIndexes() {
    try {
        console.log('Creating test document to trigger index creation...');

        // Tạo test document
        const testDoc = await addDoc(collection(db, 'notifications'), {
            receiverId: 'test-user-id',
            type: 'message',
            title: 'Test notification',
            content: 'This is a test notification to create indexes',
            isRead: false,
            createdAt: new Date(),
            metadata: { notificationType: 'test' }
        });

        console.log('Test document created:', testDoc.id);

        // Thực hiện query để trigger index creation
        console.log('Executing query to trigger index creation...');

        const q = query(
            collection(db, 'notifications'),
            where('receiverId', '==', 'test-user-id'),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        console.log('Query executed successfully, documents found:', snapshot.size);

        console.log('Index creation triggered successfully!');
        console.log('Visit Firebase Console to check index status:');
        console.log('https://console.firebase.google.com/project/test-chat-firebase-8ef22/firestore/indexes');

    } catch (error) {
        console.error('Error creating index:', error);
        console.log('Manual index creation required at:');
        console.log('https://console.firebase.google.com/project/test-chat-firebase-8ef22/firestore/indexes');
    }
}

createIndexes();