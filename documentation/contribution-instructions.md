# How to Contribute to Konnect

Prerequisites:
- Knowing what you want to do
- Having some basic understanding of frontend

1) Make a new branch, call it the feature or bugfix. If it is a bugfix, prefix it with BUGFIX. For example, adding-force-for-nodes
2) When you have finished adding your feature and tested it, stage all your files, commit, and push to your remote
3) From your remote pull request into master. Mukund will review and accept or give you comments. If you are Mukund, Mukund will approve your pr without question

These next steps are the deployment processes

4) When master has accumulated sufficient features and can be deployed, PR into deployment
5) After PR is merged, github actions should auto compile using the workflow and add files to github pages
6) Github pages serves resources and code to client