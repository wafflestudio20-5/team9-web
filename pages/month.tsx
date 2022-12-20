import Sidebar from '../components/Sidebar';
import { useSidebarContext } from '../contexts/SidebarContext';
export default function MonthPage() {
    const { isOpen } = useSidebarContext();
    return (
        <>
            {isOpen && <Sidebar />}
            <div>Month Page</div>
        </>
    );
}
