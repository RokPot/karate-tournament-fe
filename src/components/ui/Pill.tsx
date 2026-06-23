interface IProps {
    children: React.ReactNode;
}

const Pill = ({ children }: IProps) => {

    return <div className="flex flex-row flex-wrap items-center gap-0-5 rounded-[22px] border border-primary-300 bg-primary-100 px-3 py-1-5 w-fit">
        {children}
    </div>
}

export default Pill;