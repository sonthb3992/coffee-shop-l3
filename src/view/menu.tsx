import React, { useEffect, useState } from 'react';
import { MenuOption } from '../domain/menu_option';
import MenuOptionComponent from './menu-item';

interface MenuProps {
    chunkSize: number;
    typeFilter: string;
}


const Menu: React.FC<MenuProps> = ({ chunkSize, typeFilter: filter }) => {
    const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);

    useEffect(() => {
        const fetchMenuOptions = async () => {
            const result = await MenuOption.getAll();
            const filteredResult = result.filter(option => option.type === filter || filter === '');
            setMenuOptions(filteredResult);
        };

        fetchMenuOptions();
    }, [filter]);


    // A helper function to chunk the array
    const chunkArray = (myArray: MenuOption[], chunkSize: number): MenuOption[][] => {
        var index = 0;
        var arrayLength = myArray.length;
        var tempArray = [];

        for (index = 0; index < arrayLength; index += chunkSize) {
            const chunk = myArray.slice(index, index + chunkSize);
            tempArray.push(chunk);
        }

        return tempArray;
    }

    const chunkedMenuOptions = chunkArray(menuOptions, chunkSize);

    return (
        <div className='container'>
            {chunkedMenuOptions.map((chunk, chunkIndex) => (
                <div key={chunkIndex} className='columns is-desktop'>
                    {chunk.map((option) => (
                        <div className="column">
                            <MenuOptionComponent option={option} />
                        </div>
                    ))}
                    {chunk.length < chunkSize &&
                        Array(chunkSize - chunk.length).fill(0).map((_, i) => <div className="column"></div>)
                    }
                </div>
            ))}
        </div>
    );
};


// const Menu: React.FC = () => {
//     const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);

//     useEffect(() => {
//         const fetchMenuOptions = async () => {
//             const result = await MenuOption.getAll();
//             setMenuOptions(result);
//         };

//         fetchMenuOptions();
//     }, []);


//     // A helper function to chunk the array
//     const chunkArray = (myArray: MenuOption[], chunkSize: number): MenuOption[][] => {
//         var index = 0;
//         var arrayLength = myArray.length;
//         var tempArray = [];

//         for (index = 0; index < arrayLength; index += chunkSize) {
//             const chunk = myArray.slice(index, index + chunkSize);
//             tempArray.push(chunk);
//         }

//         return tempArray;
//     }

//     const chunkedMenuOptions = chunkArray(menuOptions, 4);

//     return (
//         <div className='container'>
//             {chunkedMenuOptions.map((chunk, chunkIndex) => (
//                 <div key={chunkIndex} className='columns is-desktop'>
//                     {chunk.map((option) => (
//                         <div className="column">
//                             <MenuOptionComponent option={option} />
//                         </div>
//                     ))}
//                     {chunk.length < 4 &&
//                         Array(4 - chunk.length).fill(0).map((_, i) => <div className="column"></div>)
//                     }
//                 </div>
//             ))}
//         </div>
//     );
// };


export default Menu;
