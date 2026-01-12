
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

export function uploadJSONData(dataObject: Object, filename: string, completeCallback: () => void, errorCallback: () => void) {
    const fileStorageRef = ref(storage, 'participant_data/' + filename + '.json')
    const jsonString = JSON.stringify(dataObject)
    const blob = new Blob([jsonString], { type: 'application/json' });
    const uploadTask = uploadBytesResumable(fileStorageRef, blob)
    uploadTask.on('state_changed',
        null,
        (error) => { errorCallback() },
        () => { completeCallback() }
    );
}