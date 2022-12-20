import Sidebar from '../components/Sidebar';
import { useSidebarContext } from '../contexts/SidebarContext';
export default function SchedulePage() {
    const { isOpen } = useSidebarContext();
    return (
        <>
            {isOpen && <Sidebar />}
            <div>Schedule Page</div>
        </>
    );
}
