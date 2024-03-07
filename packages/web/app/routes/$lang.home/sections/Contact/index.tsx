import { useRef, useState } from "react";
import { Checkbox } from "~/components/Core/Checkbox";
import { Section } from "~/components/Section";
import { concatClassNames } from "~/utils/utils";

export type ContactProps = {
  title: {
    title: string;
    subtitle: string;
  },
  description: string,
  submit: {
    title: string;
    url: string;
  },
  fields: [{
    __component: string;
    title?: string;
    message?: string;
    required: boolean;
    placeholder: string;
    type?: string;
  }],
  productCategories: [{
    id: number;
    title: string;
    products: [{
      id: number;
      title: string;
    }]
  }],
};

const mailRegex = /^(?!.*[Ã±Ã‘ñ])(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


export function Contact(props: ContactProps) {
  const [productOptionIndex, setProductOptionIndex] = useState<number>(0);
  const [agree, setAgree] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);


  const formItemClassName = 'flex w-full flex-col gap-4';

  return (
    <Section className="flex flex-col gap-4 w-full bg-dark-500 text-primary-300 " headlineClassName="border-primary-300" headline={props.title}>

      <span>{props.description}</span>

      <div className="flex gap-4">
        {props.productCategories.map((product, productIndex) => {
          const isSelected = productIndex === productOptionIndex;

          return (
            <Checkbox key={productIndex} isSelected={isSelected} title={product.title}
              onClick={() => {
                setProductOptionIndex(productIndex);
              }} />
          )
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span>{props.productCategories[productOptionIndex]?.title}</span>
        <select className="p-2 border-solid border borde-primary-300 bg-primary-300 text-dark-500">
          {props.productCategories[productOptionIndex]?.products.map((option) => (<option>{option.title}</option>))}
        </select>
      </div>


      <form className="flex flex-col gap-8 border-box">

        {props.fields.map((field, key) => {
          if (field.__component === "input.text-input") {
            if (field.type === "phone") {
              return (
                <div key={key} className="flex flex-col gap-4">
                  <label>{field.title}</label>
                  <div className="flex gap-4">

                    <select className=" p-2 text-primary-300 bg-transparent border-solid border">
                      <option value="+57">🇨🇴 +57 </option>
                    </select>

                    <input
                      onKeyDown={(e) => {
                        !e.key.match(/[0-9]+|Backspace|Enter|Tab|[.]/) && e.preventDefault()
                      }}
                      required={field.required}
                      className="w-full p-2 border-none bg-dark-300 text-primary-300"
                      placeholder={field.placeholder}
                    />

                  </div>

                </div>
              );
            }

            if (field.type === "mail") {
              const [isValidMail, setIsValidMail] = useState<boolean>(false);

              return (
                <div key={key} className={formItemClassName}>
                  <label className="">{field.title}</label>
                  <input
                    onChange={(e) => {
                      if (e.target.value.match(mailRegex)) {
                        setIsValidMail(true);
                        if (!isValid) setIsValid(true);
                      } else {
                        setIsValidMail(false);
                        if (isValid) setIsValid(false);
                      }
                    }}
                    required={field.required}
                    className="p-2 border-none text-primary-300 bg-dark-300"
                    placeholder={field.placeholder} />
                  {!isValidMail && <p>Your email is wrong</p>}
                </div>);
            }

            return (
              <div key={key} className={formItemClassName}>
                <label className="">{field.title}</label>
                <input required={field.required} className="p-2 border-none text-primary-300 bg-dark-300" placeholder={field.placeholder} />
              </div>);
          }

          if (field.__component === "input.checkbox") {
            return (
              <div key={key} className="flex w-full gap-4">
                <Checkbox required={field.required} isSelected={agree} title={field.message}
                  onClick={() => {
                    setAgree(!agree);
                  }} />
              </div>
            );
          }
        })}

        <div className="w-full">
          <input
          type="submit" 
          onClick={(e) => {
            if (!isValid) {
              e.preventDefault();
            }
          }} className={
            concatClassNames(`w-full flex cursor-pointer text-center text-dark-500 bg-primary-300 duration-300 ease hover:bg-primary-500 p-4 border-none"`,
              isValid ? 'bg-primary border-solid border': 'bg-dark-300'
            )
          } value={props.submit.title} />
        </div>

      </form>

    </Section>
  );
}
