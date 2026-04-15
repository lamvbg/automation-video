interface Props {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }

export default function LoadingSpinner({ text, size = 'md' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${sizes[size]} border-gray-700 border-t-violet-400 rounded-full animate-spin`}
        style={{ borderWidth: '3px', borderStyle: 'solid' }}
      />
      {text && <p className="text-gray-500 text-sm animate-pulse">{text}</p>}
    </div>
  )
}
