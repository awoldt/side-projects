export interface StackFormRequest {
  languages: string[];
  databases: string[];
  apis: string[];
  frameworks: string[];
  clouds: string[];
}

export async function CreateStackFormSubmit(
  e: React.FormEvent<HTMLFormElement>,
  techSelected: StackFormRequest,
  formRef: React.RefObject<HTMLFormElement>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  editStack?: boolean,
  stackId?: string
) {
  e.preventDefault();

  if (techSelected.languages.length === 0) {
    alert("you must select at least one programming language!");
  } else {
    const formBody = new FormData(formRef.current!);
    const thumbnail1 = formBody.get("thumbnail_1") as File;
    if (thumbnail1.size === 0) {
      alert("You must upload at least one thumbnail");
    } else {
      // add languages
      formBody.set("language", techSelected.languages[0]);
      if (techSelected.languages.length > 1) {
        for (let i = 1; i < techSelected.languages.length; i++) {
          formBody.append("language", techSelected.languages[i]);
        }
      }

      // add databases
      if (techSelected.databases[0] !== undefined) {
        formBody.set("database", techSelected.databases[0]);
        if (techSelected.databases.length > 1) {
          for (let i = 1; i < techSelected.databases.length; i++) {
            formBody.append("database", techSelected.databases[i]);
          }
        }
      } else {
        formBody.delete("database");
      }

      // add apis
      if (techSelected.apis[0] !== undefined) {
        formBody.set("api", techSelected.apis[0]);
        if (techSelected.apis.length > 1) {
          for (let i = 1; i < techSelected.apis.length; i++) {
            formBody.append("api", techSelected.apis[i]);
          }
        }
      } else {
        formBody.delete("api");
      }

      // add frameworks
      if (techSelected.frameworks[0] !== undefined) {
        formBody.set("framework", techSelected.frameworks[0]);
        if (techSelected.frameworks.length > 1) {
          for (let i = 1; i < techSelected.frameworks.length; i++) {
            formBody.append("framework", techSelected.frameworks[i]);
          }
        }
      } else {
        formBody.delete("framework");
      }

      // add clouds
      if (techSelected.clouds[0] !== undefined) {
        formBody.set("cloud", techSelected.clouds[0]);
        if (techSelected.clouds.length > 1) {
          for (let i = 1; i < techSelected.clouds.length; i++) {
            formBody.append("cloud", techSelected.clouds[i]);
          }
        }
      } else {
        formBody.delete("cloud");
      }

      // send edit stack api request
      if (editStack) {
        const req = await fetch("/api?action=edit_stack&stack_id=" + stackId, {
          method: "post",
          body: formBody,
          headers: { Accept: "application/json" },
        });
        const res = await req.json();

        if (res.status === 200) {
          document.location.assign(`/stack/${stackId}`);
        } else {
          alert("There was an error while editing stack");
        }
      }
      // send create stack api request
      else {
        const req = await fetch("/api?action=create_stack", {
          method: "post",
          body: formBody,
          headers: { Accept: "application/json" },
        });
        const res = await req.json();
        if (res.status === 200) {
          document.location.assign(`/stack/${res.stackId}?success=true`);
        } else {
          alert("There was an error while creating new stack");
        }
      }
    }
  }
}
