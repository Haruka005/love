export default function Select({ value, onChange, options }){
    return(
        <label className="selectbox">
            <select value={value} onChange={onChange}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}