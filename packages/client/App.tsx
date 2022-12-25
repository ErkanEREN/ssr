import React from 'react'
import loadable from '@loadable/component';
// import loadable from '@loadable/component'
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
