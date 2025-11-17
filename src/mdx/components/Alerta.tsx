export function Alerta({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 12,
        background: '#804040',
        borderRadius: 8,
        color: 'pink',
      }}
    >
      {children}
    </div>
  );
}
