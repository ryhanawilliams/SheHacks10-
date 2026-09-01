import SearchIcon from "../assets/Search.png";

export default function Search({ value, onChange }) {
  return (
    <>
      <div className="w-full h-full relative">
        <img
          src={SearchIcon}
          alt="Search"
          className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
        />
        <input
          className="w-full h-full border-2 border-gray-300 rounded-full pl-14 pr-12 py-4 text-xl text-gray-500 focus:outline-none focus:border-gray-300"
          type="text"
          placeholder="Search a tutorial"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </>
  );
}
