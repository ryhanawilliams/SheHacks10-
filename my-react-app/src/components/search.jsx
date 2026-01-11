export default function Search({ value, onChange }) {
  return (
    <>
      <div className="w-full h-full">
        <input
          className="w-full h-full border-2 border-gray-300 rounded-full p-2 text-xl"
          type="text"
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </>
  );
}
