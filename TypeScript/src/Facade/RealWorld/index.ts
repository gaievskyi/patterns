import * as fs from "fs/promises"

/**
 * Example Facade pattern for a ETL process. In this example I have created
 * three subsystems. The first one is the Loader (DataSource), which is a file
 * system. The second one is the Parser (DataTransformer), which is a string
 * parser. The third one is the Writer (DataSink), which is a file system.
 *
 * To keep the example simple, in the loader I'm not doing input validation. In
 * a real world scenario, I would do it creating a validation layer on the
 * extractor and passing the parsed result to the transformer.
 */

type Map = { [key: string]: any }

interface Extractor {
  extract(): Promise<string>
}

interface Transformer {
  transform(input: string): Map
}

interface Loader {
  load(input: Map): Promise<unknown>
}

class FileExtractor implements Extractor {
  constructor(public filepath: string) {}

  public async extract() {
    return fs.readFile(this.filepath, "utf8")
  }
}

class FileLoader implements Loader {
  constructor(public filepath: string) {}

  public async load(input: Map) {
    return await fs.writeFile(
      this.filepath,
      JSON.stringify(input, undefined, 4)
    )
  }
}

class FileTransformer implements Transformer {
  public transform(input: string): Map {
    let result: Map = {}

    input.split("\n").forEach((line) => {
      if (line.trim().length === 0) return

      const [key] = line.split(",")

      if (result && result[key]) {
        result[key] = result[key] + 1
      } else {
        result[key] = 0
      }
    })

    return result
  }
}

/**
 * The Facade class is the main class of the Facade pattern. It's responsible
 * for creating the subsystems and calling their methods. I'm injecting the
 * subsystems in the constructor. In the process method I'm calling the extract,
 * transform and load methods of the subsystems.
 */
class ETLProcessor {
  constructor(
    public extractor: Extractor,
    public transformer: Transformer,
    public loader: Loader
  ) {}

  public async process() {
    const input = await this.extractor.extract()
    const transformed = this.transformer.transform(input)
    return this.loader.load(transformed)
  }
}

const processor = new ETLProcessor(
  new FileExtractor("input.txt"),
  new FileTransformer(),
  new FileLoader("output.json")
)

processor.process().then(() => {
  console.log("Process completed")
})
