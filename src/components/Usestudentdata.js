import { useState, useEffect } from 'react';

const useStudentData = (getOneStudent) => {
    const [studentData, setStudentData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            try {
                const data = await getOneStudent();
                setStudentData(data);
                setError('');
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        getData();
    }, [getOneStudent]); // Dependency array to re-run the effect if getOneStudent changes

    return { studentData, isLoading, error };
};

export default useStudentData;
