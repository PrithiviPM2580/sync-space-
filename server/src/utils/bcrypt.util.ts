import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashValue = async (
	value: string,
	saltRounds: number = SALT_ROUNDS,
): Promise<string> => {
	return await bcrypt.hash(value, saltRounds);
};

export const compareValue = async (
	value: string,
	hashedValue: string,
): Promise<boolean> => {
	return await bcrypt.compare(value, hashedValue);
};
