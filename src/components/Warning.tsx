import styles from "./Warning.module.scss";

interface WarningProps {
    visible: boolean;
}

function Warning(props: WarningProps) {
    const { visible } = props;

    return (
        <div
            className={styles.warningWrapper}
            style={{
                bottom: visible ? 0 : -332,
            }}
        >
            <img alt="" src="/warning.png" />
        </div>
    );
}

export default Warning;
