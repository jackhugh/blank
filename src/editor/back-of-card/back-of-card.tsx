import Head from "next/head";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CallToActionButton } from "@/components/buttons";
import { Container } from "@/components/container";
import type { EditorDraft } from "@/components/editor/types/types";
import { useTracking } from "@/hooks/use-tracking";
import { filterClasses } from "@/utils";
import styles from "./back-of-card.module.scss";
import { validateMessage } from "./utils";

interface FormData {
  textField: string;
}

interface BackOfCardProps {
  message: string;
  setMessage: (message: string) => void;
  onComplete: () => void;
  editorDraft: EditorDraft;
}

export const BackOfCard = ({
  message,
  setMessage,
  onComplete,
  editorDraft,
}: BackOfCardProps) => {
  const { register, handleSubmit, formState, setFocus } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      textField: message,
    },
  });
  const { isValid } = formState;

  const { trackEvent } = useTracking("productBackViewed", {
    productHandle: editorDraft.productHandle,
  });

  const onSubmit = ({ textField }: FormData) => {
    onComplete();
    trackEvent("productBackNextTapped", {
      addedMessage: textField.length > 0,
      productHandle: editorDraft.productHandle,
    });
  };

  const handleCharacterCount = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const textArea = event.target;
    if (!(textArea instanceof HTMLTextAreaElement)) {
      return;
    }

    const newMessage = validateMessage(event.target.value);
    if (newMessage !== event.target.value) {
      trackEvent("messageNeedsTruncation");
    }
    event.target.value = newMessage;
    setMessage(newMessage);
  };
  const handleEditMessage = () => {
    setFocus("textField");
  };

  useEffect(() => {
    setFocus("textField");
  }, []);

  return (
    <>
      <Head>
        {/* Despite the Next.js warning, we import these fonts on the page level,
        since we know they are only going to be used here. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Container
        className={styles.containerWithHeight}
        contentClassName={styles.fullHeightContent}
      >
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.innerContainer}>
            <div className={styles.inputPositioner}>
              <div className={styles.inputContainer}>
                <h2 className={styles.title}>Your Message</h2>
                <hr className={styles.separator} />
                <textarea
                  className={filterClasses(
                    styles.textField,
                    editorDraft.productHandle === "GC" && styles.GCTextField
                  )}
                  placeholder="Now create a message and tap next to send your card to anywhere in the world."
                  {...register("textField", {
                    onChange: handleCharacterCount,
                    required: true,
                  })}
                />
              </div>
            </div>

            <div className={styles.buttonsContainer}>
              <CallToActionButton
                variant="primary"
                size="large"
                className={styles.CTA}
                type="submit"
                disabled={!isValid}
              >
                Next
              </CallToActionButton>
              <CallToActionButton
                type="button"
                disabled={false}
                variant="secondary"
                size="large"
                className={styles.CTA}
                onClick={handleEditMessage}
              >
                Edit Message
              </CallToActionButton>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};
