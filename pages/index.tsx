import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  useNodes,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes: any = [
  // { id: '1', position: { x: 0, y: 0 }, data: { label: 'Cough or cold?' } },
  // { id: '2', position: { x: -100, y: 100 }, data: { label: 'Next set of Qs' }},
  // { id: '3', position: { x: 100, y: 100 }, data: { label: 'Next set of Qs' } }
];

const initialEdges:any = [
  // { id: "e1-2", data: "cough", source: "1", target: "2", label: "cough" },
  // { id: "e1-3", data: "cold", source: "1", target: "3", label: "cold" },
];

export default function Home() {
  const [data, setData] = useState<any>();
  const rf = useReactFlow();

  //Fetched data from api
  const addNode = () => {
    
    rf.addNodes({
      id: (data?.response?.nodeDto?.questionContent?.id).toString(),
      position: { x: 0, y: 0 },
      data: {
        label: (data?.response?.nodeDto?.questionContent?.content).toString(),
      },
    });
    
    var x = -400;
    var y = 400;
    (data?.response.nodeDto.edgeDtoList).forEach((ele: any, idx :number) => {
      // console.log(ele.nodeDto.questionContent);
      let id = `${idx}-${ele.questionContent?.id}`
      rf.addNodes(
        {
        'id': id,
        position: {
          x: (x +=200),
          y: (y),
        },
        data: { label: ele.nodeDto.questionContent.content},
      });


      y=800;
      // x=-400;
      (ele.nodeDto.questionContent.answerOptionList).forEach((element:any )=> {
        rf.addNodes(
          {
          'id': `${id}-${element.id}`,
          position: {
            x: (x+=200),
            y: (y),
          },
          data: { label: element.content},
        });
        rf.addEdges(
          { 'id': `${id}-${element.id}`, 'source':`${id}` , 'target': `${id}-${element.id}` }
        )
      });


      // x= -400;
      y=400;
      rf.addNodes(
          {
            'id': id,
            position: {
              x: (x+=200),
              y: (y),
            },
            data: { label: ele.nodeDto.questionContent.answerOptionList},
          
      }
      )



      console.log(ele.conditionDto.answerOptionDtoList[0].content);
      rf.addEdges(
        { 'id': `${data?.response?.nodeDto?.questionContent?.id}-${id}`, 'source':`${data?.response?.nodeDto?.questionContent?.id}` , 'target': id, label: `${ele.conditionDto.answerOptionDtoList[0].content}` }
      )
      
    });

    // ((data?.response.nodeDto.questionContent.answerOptionList).forEach((element:any) => {
    //   console.log(element.content)
    //   rf.addNodes({ id: `${data?.response?.nodeDto?.questionContent?.id}-${element.content}`, data:'cough','source': id.toString(), target: element.content, label:element.content })
    // }))
  };
  const fetchData = async () => {
    const apiUrl = `http://3.13.92.74:30005/questionnaire/admin/question-workflow/id/f1745111-d251-444c-bd9d-63e19615b551`;

    await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-USER-ID": "test",
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res.response);
        setData(res);
        addNode();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="" style={{ width: "100vw", height: "100vh" }}>
      <button className="bg-blue-500 text-white font-xl" onClick={fetchData}>
        Fetch
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      ></ReactFlow>
    </div>
  );
}
