
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
  phone?: string;
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
  updateProfile: (data: Partial<Pick<UserProfile, 'fullName' | 'phone' | 'imageUrl'>>) => Promise<void>;
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

  const fetchUserProfile = async (fbUser: FirebaseUser) => {
    const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
    if (userDoc.exists()) {
      const userProfile = { ...userDoc.data(), uid: fbUser.uid, emailVerified: fbUser.emailVerified } as UserProfile;
      
      const isAdmin = fbUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      if(fbUser.emailVerified || isAdmin) {
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
       // If user exists in Auth but not in Firestore DB, it's likely the admin.
      if (fbUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        const adminProfile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email,
          fullName: 'Admin',
          imageUrl: '',
          emailVerified: true, // Always treat admin as verified
        };
        setUser(adminProfile);
      } else {
        setUser(null); // No profile found in firestore for non-admin user
      }
    }
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        await fetchUserProfile(fbUser);
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

    const isAdmin = userCredential.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!isAdmin && !userCredential.user.emailVerified) {
      await firebaseSignOut(auth);
      const error: any = new Error("Email not verified. Please check your inbox.");
      error.code = "auth/email-not-verified";
      throw error;
    }
  };

  const signOut = async () => {
    const isAdminPage = window.location.pathname.startsWith('/admin');
    await firebaseSignOut(auth);
    router.push(isAdminPage ? '/admin/login' : '/login');
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
  
  const updateProfile = async (data: Partial<Pick<UserProfile, 'fullName' | 'phone' | 'imageUrl'>>) => {
    if (!firebaseUser) throw new Error("No user is currently signed in.");

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await updateDoc(userDocRef, data);
    // Re-fetch user profile to update context state
    await fetchUserProfile(firebaseUser);
  };


  const value = {
    user,
    firebaseUser,
    loading,
    signUp,
    signIn,
    signOut,
    sendVerificationEmail,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
