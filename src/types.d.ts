interface ApiOption {
	text: string;
	urlParam: string;
}

type Action = () => void;
type Action<T extends unknown[] = []> = (...args: T) => void;
