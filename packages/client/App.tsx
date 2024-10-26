import React from 'react'
const YetOtherComponent= loadable(() => import("./components/YetOtherComponent"));
const OtherComponent= loadable(() => import("./components/OtherComponent"));
const App = () =>{
    // const OtherComponent2 = loadable(() => import('./components/OtherComponent'))
    return <>
    a
    {/* <OtherComponent2 variant="contained" text="sometext"/> */}
    <YetOtherComponent variant="contained" text="sometext1" />
    <OtherComponent variant="contained" text="sometext2" />
    </>
}

export default App
