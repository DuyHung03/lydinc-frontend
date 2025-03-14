import { isMobile } from 'react-device-detect';
import Router from './route/router';
function App() {
    if (isMobile) {
        return (
            <div className='w-full h-screen flex flex-col justify-start mt-10 items-center'>
                <img
                    src={
                        'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2Flogo_1.png?alt=media&token=3220d663-6343-4966-9b48-0735e9161d1d'
                    }
                    className='w-72'
                />
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
