import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Book {
    [key: string]: any;
}

interface Props {
    csvData: Book[];
}

export default function BookGrid({ csvData }: Props) {
    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [gridCols, setGridCols] = useState('grid-cols-1'); // State for grid columns
    const router = useRouter();

    const handleClick = (book: Book) => {
        router.push(`/viewer/${book["Epub.No"]}`);
    };


    const handleImagePath = (book: Book) => {
        const src = `/books/ebook_cover_images/${book["Epub.No"]}.jpg`;
        return src;
    };

    useEffect(() => {
        // Function to update grid columns based on window width
        const updateGridCols = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 640) {
                setGridCols('grid-cols-1');
            } else if (screenWidth < 768) {
                setGridCols('grid-cols-1');
            } else if (screenWidth < 1024) {
                setGridCols('grid-cols-2');
            } else {
                setGridCols('grid-cols-3');
            }
        };

        // Call the function once to set initial grid columns
        updateGridCols();

        // Listen for window resize events and update grid columns
        window.addEventListener('resize', updateGridCols);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateGridCols);
        };
    }, []); // Empty dependency array ensures this effect runs only once on component mount


    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, csvData.length);

    return (
        <>
            <div className={`grid gap-4 ${gridCols}`}>
                {csvData.slice(startIndex, endIndex).map((book: Book, index: number) => (
                    <button
                        key={index}
                        className="border border-gray-400 bg-white rounded p-0 flex flex-col leading-normal text-left hover:bg-blue-300 h-min:100px"
                        onClick={() => handleClick(book)}
                    >
                        <div className="flex space-x-4 overflow-hidden truncate w-full hover:overflow-visible">
                        <div className="w-1/3 min-w-[33.33%] max-w-[33.33%] h-[180px]">
                            <img
                                src={handleImagePath(book)}
                                alt="Image Not Available"
                                className="object-fill w-full h-full text-wrap"
                            />
                        </div>
                            <div className="flex flex-col overflow-hidden pt-2 pr-2">
                                <h2 className="text-gray-900 font-bold text-base truncate hover:overflow-hidden hover:whitespace-normal hover:line-clamp-3">
                                    {book["Title"]}
                                </h2>
                                <div className="flex space-x-4">
                                    <p className="text-gray-700 text-sm">Author: </p>
                                    <p className="text-gray-700 text-sm overflow-hidden whitespace-normal">
                                        {book["Author"]}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            {/* Pagination controls */}
            <div className="flex justify-center mt-4">
                <button
                    className="bg-gray-300 hover:bg-blue-400 py-1 px-4 rounded"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <p className="mx-4">Page {currentPage}</p>
                <button
                    className="bg-gray-300 hover:bg-blue-400 py-1 px-4 rounded"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={endIndex >= csvData.length}
                >
                    Next
                </button>
            </div>
        </>
    );
}
