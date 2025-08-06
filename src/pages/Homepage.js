// import React from 'react';
// import Header from '../components/Header';
// const Homepage = () => {
//   return (
//     <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      
//       <main className="flex-grow p-6 overflow-hidden flex">
//         <div className="flex-grow mr-4">
//           <h2 className="text-2xl font-semibold mb-6 text-blue-400">Market Summary</h2>
          
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Homepage;


import React from 'react';
import Header from '../components/Header';

const Homepage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">

      <main className="flex-grow p-6 pt-32 flex flex-col items-center justify-start">
  <h1 className="text-7xl font-extrabold text-blue-400 text-center">
    Welcome to Tradesphere
  </h1>

  <p className="text-xl text-gray-300 mt-4 text-center">
    Empowering traders with insights, speed, and precision.
  </p>
</main>

    </div>
  );
};

export default Homepage;
