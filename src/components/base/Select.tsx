import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const customStyles = (isDarkMode: boolean) => ({
  control: (base: any) => ({
    ...base,
    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
    borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
    color: isDarkMode ? "#ffffff" : "#000000",
    boxShadow: "none",
    "&:hover": {
      borderColor: isDarkMode ? "#9ca3af" : "#6b7280",
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
    color: isDarkMode ? "#ffffff" : "#000000",
    zIndex: 9999,
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: isDarkMode ? "#f87171" : "#ef4444",
    "&:hover": {
      backgroundColor: isDarkMode ? "#f87171" : "#ef4444",
      color: "#ffffff",
    },
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? (isDarkMode ? "#374151" : "#e5e7eb") : state.isFocused ? (isDarkMode ? "#4b5563" : "#f3f4f6") : isDarkMode ? "#1f2937" : "#ffffff",
    color: isDarkMode ? "#ffffff" : "#000000",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: isDarkMode ? "#ffffff" : "#000000",
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  input: (base: any) => ({
    ...base,
    color: isDarkMode ? "#ffffff" : "#000000",
  }),
});

interface SelectProps {
  id: string;
  isDarkMode: boolean;
  optionMember: Options[];
  onChange: (e: Options[] | null) => void;
}

type Options = { value: string; label: string };

const animatedComponents = makeAnimated();

const SelectComponent = (props: SelectProps) => {
  return <Select id="member" menuPortalTarget={document.body} styles={customStyles(props.isDarkMode)} closeMenuOnSelect={false} components={animatedComponents} isMulti options={props.optionMember} onChange={(e) => props.onChange(e as Options[] | null)} />;
};

export default SelectComponent;
