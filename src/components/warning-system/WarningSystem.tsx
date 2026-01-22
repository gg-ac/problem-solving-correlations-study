import { usePageContext } from '@/context/PageContext';
import React, { ReactNode, useEffect } from 'react';

const WarningSystem: React.FC = () => {
    const maxStrikes = 3;

    const { rejectedParticipantRedirectURL, strikes, taskData, addTaskData, incrementStrikes } = usePageContext();


    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            const newCount = strikes + 1;
            if (newCount < maxStrikes) {
                alert(`You switched to another window during a study task. You have been given one strike. You have ${maxStrikes - newCount} strike(s) left. Please complete the remainder of the study without switching to other tabs or windows.`);
            } else {
                alert('You have been rejected from the study due to too many strikes.');

                if (rejectedParticipantRedirectURL != null) {
                    const w = window.open(rejectedParticipantRedirectURL, "_self");
                }
            }
            addTaskData({ taskName: "warning-strike", data: [{ "type": "visibility-change", "number": newCount, "timestamp": (new Date()).toTimeString() }] })
            incrementStrikes();
            console.log(strikes)
            console.log(rejectedParticipantRedirectURL)
        }
    };

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [strikes]);

    return <></>
    
};

export default WarningSystem;
