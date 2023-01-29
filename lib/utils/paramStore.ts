//referenced https://gist.github.com/cbschuld/938190f81d00934f7a158ff223fb5e02#file-parameterstore-ts

import { SSM } from 'aws-sdk';

const getParameterWorker = async (
    name: string,
    decrypt: boolean,
): Promise<string | undefined> => {
    const ssm = new SSM({ region: 'ap-northeast-2' });
    const result = await ssm
        .getParameter({ Name: name, WithDecryption: decrypt })
        .promise();
    return result.Parameter?.Value;
};

export const getParameter = async (
    name: string,
): Promise<string | undefined> => {
    return getParameterWorker(name, false);
};

export const getEncryptedParameter = async (
    name: string,
): Promise<string | undefined> => {
    return getParameterWorker(name, true);
};
