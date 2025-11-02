
import React from 'react'
export function Card({ className='', children }: any){ return <div className={`bg-white border border-slate-200 ${className}`}>{children}</div> }
export function CardHeader({ className='', children }: any){ return <div className={`p-4 border-b border-slate-100 ${className}`}>{children}</div> }
export function CardContent({ className='', children }: any){ return <div className={`p-4 ${className}`}>{children}</div> }
export function CardTitle({ className='', children }: any){ return <div className={`text-lg font-semibold ${className}`}>{children}</div> }
