'use client'

import { useState } from 'react'
import { login } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Shield, Sparkles, LogIn, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const res = await login(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Branding Section */}
      <div className="hidden lg:flex w-1/2 bg-indigo-900 relative flex-col justify-between overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm tracking-tight text-white">
              A&P
            </div>
            <span className="text-2xl font-bold tracking-tight">Workspace</span>
          </div>
        </div>
        
        <div className="relative z-10 p-12 pb-24 text-white">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Manage your clients <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-fuchsia-300">
              like a pro.
            </span>
          </h1>
          <p className="text-indigo-200 text-lg max-w-md leading-relaxed">
            Streamline your workflow, track revenue effortlessly, and keep your leads organized in one beautiful workspace.
          </p>
          
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-400 to-fuchsia-400 border-2 border-indigo-900 flex items-center justify-center text-xs font-bold shadow-lg">P</div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-400 border-2 border-indigo-900 flex items-center justify-center text-xs font-bold shadow-lg">A</div>
            </div>
            <p className="text-sm font-medium text-indigo-200">Built for Priyank & Ayushi</p>
          </div>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative overflow-hidden bg-gray-50/30">
        <div className="w-full max-w-md relative z-10">
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-6 lg:hidden shadow-sm border border-indigo-100">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 mt-3 text-lg">Enter your details to access your workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="identifier" className="text-sm font-semibold text-gray-700">Email or Mobile Number</Label>
              <div className="relative">
                <Input 
                  id="identifier" 
                  name="identifier" 
                  type="text" 
                  required 
                  placeholder="name@example.com or 9876543210" 
                  className="w-full pl-4 pr-4 py-6 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all text-base shadow-sm bg-white"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  className="w-full pl-4 pr-4 py-6 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all text-base shadow-sm bg-white"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 rounded-xl bg-gray-900 hover:bg-indigo-600 text-white font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-indigo-500/30 flex items-center justify-center gap-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In <LogIn className="w-5 h-5 ml-1" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Secure connection established</span>
          </div>
        </div>
      </div>
    </div>
  )
}
