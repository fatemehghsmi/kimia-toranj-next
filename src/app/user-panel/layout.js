// app/user-panel/layout.jsx
import Header from "@/components/Header/Header";
import SidebarUserPanel from "@/components/SidebarUserPanel/SidebarUserPanel";
import styles from "./UserPanel.module.css";

export default function UserPanelLayout({ children }) {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <SidebarUserPanel />
        </aside>
        <div className={styles.content}>
          {children} {/* replaces <Outlet /> */}
        </div>
      </div>
    </div>
  );
}
