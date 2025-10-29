'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendEmailVerification,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  imageUrl: string;
  emailVerified: boolean;
  mobileVerified: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signUp: (userData: Omit<UserProfile, 'uid'>, password: string) => Promise<FirebaseUser>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateUserVerificationStatus: (uid: string, type: 'email' | 'mobile', status: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          setUser({ ...userDoc.data(), uid: fbUser.uid } as UserProfile);
        } else {
            setUser(null); // No profile found in firestore
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (userData: Omit<UserProfile, 'uid'>, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const { uid } = userCredential.user;
    
    const userProfileData: UserProfile = { ...userData, uid };
    
    await setDoc(doc(db, 'users', uid), userProfileData);
    
    // This doesn't send OTP, but a verification link.
    // For OTP, a third-party service like Twilio is needed.
    // We will simulate the OTP flow.
    await sendEmailVerification(userCredential.user);
    
    return userCredential.user;
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/login');
  };

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error("No user is currently signed in.");
    }
  };
  
  const updateUserVerificationStatus = async (uid: string, type: 'email' | 'mobile', status: boolean) => {
    const userDocRef = doc(db, 'users', uid);
    if(type === 'email'){
        await updateDoc(userDocRef, { emailVerified: status });
    } else {
        await updateDoc(userDocRef, { mobileVerified: status });
    }
  };


  const value = {
    user,
    firebaseUser,
    loading,
    signUp,
    signIn,
    signOut,
    sendVerificationEmail,
    updateUserVerificationStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
