// This file exports a wrapper for all teacher pages to get darkMode from Outlet context
import { useOutletContext } from 'react-router-dom';

export const useTeacherContext = () => {
    const context = useOutletContext();
    return context || { darkMode: false };
};
