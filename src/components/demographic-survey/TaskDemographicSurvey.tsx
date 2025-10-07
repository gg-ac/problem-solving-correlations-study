"use client"
import { useEffect } from "react";
import { usePageContext } from "@/context/PageContext";
import { useTaskContextDemographicSurvey } from "./TaskContextDemographicSurvey";


export default function TaskDemographicSurvey() {

    const { state, setParticipantID, setBiologicalSex, setAge, setHandedness, setSurveyCompleted } = useTaskContextDemographicSurvey();
    const { taskData, participantID, setTaskData, pages, currentPageIndex, setCurrentPageIndex } = usePageContext();

    useEffect(() => {
        if(state.surveyCompleted){
        const taskEventData = state
        setTaskData([...taskData, {taskName:"demographic-survey", data:[taskEventData]}])
        currentPageIndex + 1 < pages.length ? setCurrentPageIndex(currentPageIndex + 1) : null
        }
    }, [state.surveyCompleted]);

    useEffect(() => {
        setParticipantID(participantID)
    }, [])
    

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case 'biologicalSex':
        setBiologicalSex(value as "male" | "female" | null);
        break;
      case 'age':
        setAge(Number(value));
        
        break;
      case 'handedness':
        setHandedness(value as "left" | "right" | "ambidextrous" | null);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    if (state.age == null || state.biologicalSex == null || state.handedness == null){
        alert("Please complete all the questions")
    }else{
        setSurveyCompleted(true);
    }
  };


  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-slate-700 p-6 rounded shadow-md w-80">
        <h2 className="text-center text-2xl font-bold mb-4">Demographic Survey</h2>
        
        <div className="mb-8">
          <label htmlFor="age" className="block text-lg font-medium text-gray-200">Age (Years):</label>
          <input 
            type="number" 
            id="age" 
            name="age" 
            value={state.age || ''} 
            onChange={handleChange} 
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
          />
        </div>
        
        <div className="mb-8">
          <label htmlFor="biologicalSex" className="block text-lg font-medium text-gray-200">Biological Sex:</label>
          <select 
            id="biologicalSex" 
            name="biologicalSex" 
            value={state.biologicalSex || ''} 
            onChange={handleChange} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        
        <div className="mb-8">
          <label htmlFor="handedness" className="block text-lg font-medium text-gray-200">Handedness:</label>
          <select 
            id="handedness" 
            name="handedness" 
            value={state.handedness || ''} 
            onChange={handleChange} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
          >
            <option value="">Select...</option>
            <option value="left">Left-handed</option>
            <option value="right">Right-handed</option>
            <option value="ambidextrous">Ambidextrous</option>
          </select>
        </div>

        <button 
            onClick={() => handleSubmit()}
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200">
          Submit
        </button>
      </div>
    </div>
  );
};