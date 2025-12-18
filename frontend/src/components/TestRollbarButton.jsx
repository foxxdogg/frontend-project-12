import { useRollbar } from '@rollbar/react';

const TestRollbarButton = () => {
  const rollbar = useRollbar();

  const handleClick = () => {
    rollbar.error('Manual Rollbar test');
  };

  return (
    <button type="button" onClick={handleClick}>
      Test Rollbar
    </button>
  );
};

export default TestRollbarButton;
