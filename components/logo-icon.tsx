import Image from 'next/image'

export default function LogoIcon({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        backgroundColor: '#042C53',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
        padding: 2,
      }}
    >
      <Image
        src="/capusflow_logo-removebg-preview.png"
        alt="CampusFlow"
        width={size}
        height={size}
        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
      />
    </div>
  )
}
