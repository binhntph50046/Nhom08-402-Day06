
import BlurBox from "../BlurBox/BlurBox";
import { Link } from "react-router-dom";

const IntroNewVersion = () => {
    return (
        <Link to='https://myjoyfilm.vercel.app/' target="_blank"
            className="block mb-4 rounded-lg overflow-hidden text-center group">
            <BlurBox>
                <div className="py-2 px-4 text-sm sm:text-base text-heading
                                group-hover:bg-gradient-to-r from-red-500 to-indigo-500">
                    🥳🎉🎊 Hãy thử phiên bản mới của Joy Film (NextJS) tại đây - Nhanh hơn và ổn định hơn 🥳🎉🎊
                </div>
            </BlurBox>
        </Link>
    );
};

export default IntroNewVersion;
