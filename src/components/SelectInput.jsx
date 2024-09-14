import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const SelectInput = ({ options, selectedOption, text = false, setSelectedOption, firstNull, onChange = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const selectRef = useRef(null)
  const dropdownRef = useRef(null)

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption({...option, all: option?.all ? true : false});
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      setIsOverflowing(dropdownRect.bottom > windowHeight);
    }
  }, [isOpen]);

  return (
    <div className="relative w-full">
      <div
        className={`${selectedOption?.bg || "bg-transparent"} ${selectedOption?.transparent ? "text-transparent" : "text-white"} ${!text && "p-2 px-4"} border max-w-full border-2 border-white rounded-lg text-xl cursor-pointer`}
        onClick={toggleOpen}
        ref={selectRef}
      >
        {text ? <div className='w-full flex max-w-full items-center justify-between'>
          <input value={selectedOption?.value} className='bg-transparent p-2 px-4 w-4/5 outline-none' onChange={e => handleOptionClick({value: e?.target?.value})}/>
          <FaChevronDown className='w-1/5'/>
        </div>
        : selectedOption?.value}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute bg-white border border-gray-300 rounded-lg mt-1 overflow-hidden w-full shadow-lg z-10 ${isOverflowing ? "overflow-y-auto max-h-[200px]" : ""}`}
            ref={dropdownRef}
          >
            {options.map((option, index) => (
              <div
                key={index}
                className={`p-2 ${option.bg ? option.bg + " hover:opacity-70" : "hover:bg-gray-100"} ${option?.transparent && "text-transparent"} cursor-pointer`}
                onClick={() => handleOptionClick(option)}
              >
                {option.value}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectInput