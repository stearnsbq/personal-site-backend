import axios, { ResponseType } from "axios";
import { Inject, Service } from "typedi";
import { MongoService } from "./MongoService";
import { schedule, ScheduledTask } from "node-cron";

@Service()
export class GithubService {
  private query = `   {
        user(login: "stearnsbq") {
          repositories (first :100 privacy: PUBLIC isFork:false) {
            nodes {
              id,
              createdAt,
              name,
              url,
              languages (first: 100){
                  nodes{
                      name
                  }
              }
              pushedAt,
              stargazers{
                totalCount
              },
              forks {
                totalCount
              },
              description,
            }
          }
        }
      }`;

  @Inject()
  private _mongo: MongoService;

  private timer: ScheduledTask;

  constructor() {
    // this.updateGithubProjects();
    //this.timer = schedule('0 0 * * *', this.updateGithubProjects.bind(this));
  }

  public updateGithubProjects() {
    axios
      .post(
        "https://api.github.com/graphql",
        { query: this.query },
        {
          headers: {
            Authorization: `bearer ${process.env.GIT_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then(
        async ({
          data: {
            data: { user },
          },
        }: any) => {
          const {
            repositories: { nodes },
          } = user;

          for (const {
            name,
            url,
            id,
            languages,
            pushedAt,
            stargazers,
            forks,
            description,
            createdAt,
          } of nodes) {
            await this._mongo.project.findOneAndUpdate(
              { githubID: id },
              {
                title: name,
                githubURL: url,
                githubID: id,
                created: new Date(createdAt),
                lastUpdated: new Date(pushedAt),
                forks: forks["totalCount"],
                stars: stargazers["totalCount"],
                languages: languages["nodes"].map(
                  (language: { name: string }) => language.name
                ),
                description,
              },
              { upsert: true }
            );
          }
        }
      );
  }
}
