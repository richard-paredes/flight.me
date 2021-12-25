// yup-extended.ts
import { isValidPhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";
import { AnyObject, Maybe } from "yup/lib/types";

Yup.addMethod<Yup.StringSchema>(Yup.string, "emptyAsUndefined", function () {
    return this.transform((value) => (value ? value : undefined));
});

Yup.addMethod<Yup.StringSchema>(Yup.string, "phoneNumber", function (message: string) {
    return this.test({
        name: "phoneNumber",
        message: message,
        test: (value) => isValidPhoneNumber(value)
    });
});

Yup.addMethod<Yup.NumberSchema>(Yup.number, "emptyAsUndefined", function () {
    return this.transform((value, originalValue) =>
        String(originalValue)?.trim() ? value : undefined
    );
});

declare module "yup" {
    interface StringSchema<
        TType extends Maybe<string> = string | undefined,
        TContext extends AnyObject = AnyObject,
        TOut extends TType = TType
        > extends Yup.BaseSchema<TType, TContext, TOut> {
        emptyAsUndefined(): StringSchema<TType, TContext>;
        phoneNumber(message: string): StringSchema<TType, TContext>;
    }

    interface NumberSchema<
        TType extends Maybe<number> = number | undefined,
        TContext extends AnyObject = AnyObject,
        TOut extends TType = TType
        > extends Yup.BaseSchema<TType, TContext, TOut> {
        emptyAsUndefined(): NumberSchema<TType, TContext>;
    }
}

export default Yup;