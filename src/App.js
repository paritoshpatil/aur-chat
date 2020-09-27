import React from 'react';
import './App.sass';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

firebase.initializeApp({
	apiKey: 'AIzaSyABhLhdyUV8E4YK-WxfvCykg_bk3GiBpKI',
	authDomain: 'aur-chat.firebaseapp.com',
	databaseURL: 'https://aur-chat.firebaseio.com',
	projectId: 'aur-chat',
	storageBucket: 'aur-chat.appspot.com',
	messagingSenderId: '524593714342',
	appId: '1:524593714342:web:8e22e7ee86bb7f6f021067',
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
	const [user] = useAuthState(auth);

	return (
		<div>
			<Navbar />
			<div className='main container is-fluid'>
				<section className='chat-main'>
					{user ? <ChatRoom /> : <Welcome />}
				</section>
			</div>
			<footer>
				<Footer />
			</footer>
		</div>
	);
}

function Welcome() {
	return (
		<div className='welcome'>
			<h1 className='title is-1'>
				Welcome to <span className='blue'>Aur.</span>
			</h1>
			<p>an all-for-one chat app with a refreshing focus on simplicity</p>
		</div>
	);
}

function ChatRoom() {
	const messageRef = firestore.collection('messages');
	const query = messageRef.orderBy('timestamp').limit(25);

	const [messages] = useCollectionData(query, { idField: 'id' });

	const [formValue, setFormValue] = useState('');
	const [notif, setNotif] = useState(false);

	const sendMessage = async (e) => {
		e.preventDefault();

		const { uid, photoURL } = auth.currentUser;

		if (formValue !== '') {
			await messageRef.add({
				text: formValue,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				uid: uid,
				photoURL: photoURL,
			});
		} else {
			setNotif(true);
		}

		setFormValue('');
	};

	return (
		<div className='chatbox box'>

			<h1 className='title is-1 chatroom-title'>Aur1</h1>
			{messages &&
				messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

			<form onSubmit={sendMessage} className='input-form'>
				<div className='field has-addons'>
					<div className='control input-control'>
						<input
							type='text'
							className='input is-primary is-rounded'
							value={formValue}
							onChange={(e) => setFormValue(e.target.value)}
						/>
					</div>

					<div className='control button-control'>
						<button className='button is-primary is-rounded' type='submit'>
							send
						</button>
					</div>
				</div>
			</form>

			{notif && (
				<div class='notification is-danger'>
					<button class='delete' onClick={(e) => setNotif(false)}></button>
					You cannot send an empty message.
				</div>
			)}
		</div>
	);
}

function SignIn() {
	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	};

	return (
		!auth.currentUser && (
			<button
				onClick={signInWithGoogle}
				className='button is-primary is-outlined is-rounded'
			>
				Sign In with Google
			</button>
		)
	);
}

function SignOut() {
	return (
		auth.currentUser && (
			<button
				onClick={() => auth.signOut()}
				className='button is-danger is-outlined is-rounded'
			>
				Sign-Out
			</button>
		)
	);
}

function ChatMessage(props) {
	const { text, uid, photoURL } = props.message;
	const isSender = uid === auth.currentUser.uid ? 'sender' : 'reciever';
	return (
		<div className={`message ${isSender}`}>
			<img
				src={
					photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'
				}
			/>
			<p>{text}</p>
		</div>
	);
}

function Navbar() {
	return (
		<div>
			<nav class='navbar' role='navigation' aria-label='main navigation'>
				<div class='navbar-brand'>
					<a class='navbar-item' href='#'>
						<h1>AurChat.</h1>
					</a>
				</div>

				<div class='navbar-end'>
					<div class='navbar-item'>
						<div class='buttons'>
							<SignIn />
							<SignOut />
							<button className='button is-info is-rounded'>About</button>
						</div>
					</div>
				</div>
			</nav>
		</div>
	);
}

function Footer() {
	return (
		<div className='footer'>
			<p>Made with ❤ using React, Firebase and Bulma.</p>
		</div>
	);
}

export default App;
