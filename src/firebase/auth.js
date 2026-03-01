import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from './config'

const googleProvider = new GoogleAuthProvider()

export const subscribeToAuthChanges = (callback) => onAuthStateChanged(auth, callback)

export const signUpWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) {
    await updateProfile(userCredential.user, { displayName })
  }
  return userCredential
}

export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)

export const logOutUser = () => signOut(auth)