import { isMobile } from 'react-device-detect';
import logo from '../src/assets/logo_1.png';
import Router from './route/router';
function App() {
    if (isMobile) {
        return (
            <div className='w-full h-screen flex flex-col justify-start mt-10 items-center'>
                <img src={logo} className='w-72' />
                Using <strong>tablet</strong> or <strong>laptop</strong> to access LYDINC QA
                Website.
            </div>
        );
    }
    return (
        <>
            <Router />
        </>
    );
}

export default App;
