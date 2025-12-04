'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
const AuthContext = createContext({})
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  // Helps to check admin status please do not touch!!
  const checkAdminStatus = async (userId) => {
    if (!userId) {
      setIsAdmin(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
        return
      }

      setIsAdmin(data?.is_admin ?? false)
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        await checkAdminStatus(currentUser.id)
      }
      
      setLoading(false)
    }

    getSession()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
          await checkAdminStatus(currentUser.id)
        } else {
          setIsAdmin(false)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])
  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData 
        }
      })
      if (error) throw error
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            receive_promotions: userData.receive_promotions || false,
            is_admin: false
          })
        
        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }
  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
  const updateProfile = async (updates) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: updates
      })
      
      if (authError) throw authError
      
      // Try to update the profiles table, but don't fail if it doesn't work
      try {
        await supabase
          .from('profiles')
          .update({
            first_name: updates.first_name,
            last_name: updates.last_name,
            receive_promotions: updates.receive_promotions
          })
          .eq('id', user.id)
      } catch (profileError) {
        console.log('Profile table update skipped (may be handled by trigger):', profileError)
      }
      
      return { data: authData, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    isAdmin,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}