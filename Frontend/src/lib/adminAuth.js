import { supabase } from '../lib/supabase'

export async function checkIsAdmin(userId) {
  if (!userId) return false
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error checking admin status:', error)
      return false
    }
    
    return data?.is_admin === true
  } catch (err) {
    console.error('Error in checkIsAdmin:', err)
    return false
  }
}

export async function requireAdmin(userId) {
  const isAdmin = await checkIsAdmin(userId)
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required')
  }
  return true
}
