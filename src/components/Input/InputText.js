import { useState } from "react";

function InputText({
  labelTitle,
  labelStyle,
  type,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
}) {
  const [value, setValue] = useState(defaultValue);

  const updateInputValue = (val) => {
    setValue(val);
    updateFormValue(val, updateType); // Pass both value and updateType to the parent component
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={"label-text text-base-content " + labelStyle}>
          {labelTitle}
        </span>
      </label>
      {/* Check if type is 'file' and handle accordingly */}
      {type === "file" ? (
        <input
          type={type}
          placeholder={placeholder || ""}
          onChange={(e) => updateInputValue(e.target.files[0])}
          className="input  input-bordered w-full"
        />
      ) : (
        <input
          type={type || "text"}
          value={value}
          placeholder={placeholder || ""}
          onChange={(e) => updateInputValue(e.target.value)}
          className="input  input-bordered w-full"
        />
      )}
    </div>
  );
}

export default InputText;
