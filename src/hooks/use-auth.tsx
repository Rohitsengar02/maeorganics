
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
  imageUrl: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signUp: (userData: Omit<UserProfile, 'uid' | 'emailVerified'>, password: string) => Promise<FirebaseUser>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendVerificationEmail: (email: string, password: string) => Promise<void>;
  updateUserVerificationStatus: (uid: string, type: 'email', status: boolean) => Promise<void>;
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
          const userProfile = { ...userDoc.data(), uid: fbUser.uid, emailVerified: fbUser.emailVerified } as UserProfile;
          
          if(fbUser.emailVerified) {
            setUser(userProfile);
          } else {
            setUser(null);
          }
          
          // Sync firestore if firebase auth state is different
          if (userDoc.data().emailVerified !== fbUser.emailVerified) {
             await updateDoc(doc(db, 'users', fbUser.uid), {
                emailVerified: fbUser.emailVerified
             });
          }
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

  const signUp = async (userData: Omit<UserProfile, 'uid' | 'emailVerified'>, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const { uid } = userCredential.user;
    
    const userProfileData: Omit<UserProfile, 'emailVerified'> & { emailVerified: boolean } = { ...userData, uid, emailVerified: false };
    
    await setDoc(doc(db, 'users', uid), userProfileData);
    
    await sendEmailVerification(userCredential.user);
    
    return userCredential.user;
  };

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      await firebaseSignOut(auth);
      const error: any = new Error("Email not verified. Please check your inbox.");
      error.code = "auth/email-not-verified";
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/login');
  };

  const sendVerificationEmail = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
            await sendEmailVerification(userCredential.user);
            await firebaseSignOut(auth); // Sign out immediately after sending email
        }
    } catch (error) {
        // If sign-in fails, we still want to let the user know.
        // The calling function will handle the toast.
        throw error;
    }
  };
  
  const updateUserVerificationStatus = async (uid: string, type: 'email', status: boolean) => {
    const userDocRef = doc(db, 'users', uid);
    if(type === 'email'){
        await updateDoc(userDocRef, { emailVerified: status });
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
