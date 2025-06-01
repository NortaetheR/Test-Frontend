import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "../components/styles/sidepanel.module.css";

interface SidePanelProps {
    children: ReactNode;
}

export default function SidePanel({ children }: SidePanelProps) {
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={styles.sidepanel_layout}>
            <div
                className={styles.sidepanel + (expanded ? " " + styles.sidepanel_expanded : "")}
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
                style={{ zIndex: 100 }}
            >
                <div className={styles.menuHeader}>
                    <span className={styles.menuIconWrap + " " + (expanded ? styles.menuIconExpanded : styles.menuIconCollapsed)}>
                        <span className={styles.menuIcon}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                        <span className={styles.menuTitle + " " + (expanded ? styles.menuTitleShow : styles.menuTitleHide)}>Menu</span>
                    </span>
                </div>
                <Link to="/"
                    className={
                        styles.sidepanel_link +
                        (location.pathname === "/" ? " " + styles.active : "") +
                        (expanded ? " " + styles.linkExpanded : " " + styles.linkCollapsed)
                    }
                >
                    <span className={styles.icon}>📝</span>
                    <span className={styles.linkText + " " + (expanded ? styles.linkTextShow : styles.linkTextHide)}>Form</span>
                </Link>
                <Link to="/table"
                    className={
                        styles.sidepanel_link +
                        (location.pathname === "/table" ? " " + styles.active : "") +
                        (expanded ? " " + styles.linkExpanded : " " + styles.linkCollapsed)
                    }
                >
                    <span className={styles.icon}>📦</span>
                    <span className={styles.linkText + " " + (expanded ? styles.linkTextShow : styles.linkTextHide)}>Tabel</span>
                </Link>
            </div>
            <div className={styles.sidepanel_content + (expanded ? " " + styles.contentDimmed : "")}>{children}</div>
        </div>
    );
}
