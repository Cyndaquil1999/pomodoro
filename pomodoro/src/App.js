import React from 'react';
import Timer from './modules/Timer';

const App = () => {
  return (
    <div>
      <Timer workTime={25} breakTime={5} longBreakTime={15} cycles={4} />
    </div>
  );
};

export default App;