interface NavButtonProps {
  direction?: 'left' | 'right';
  onClick: () => void;
}

function NavButton({ direction='left', onClick }: NavButtonProps) {
  return (
    <button className={`nav-button ${direction}`} onClick={onClick}>
      <svg viewBox="0 0 24 24">
        <path d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
      </svg>
    </button>
  );
}

export default NavButton;